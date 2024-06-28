(function() {
  'use strict';


  // ページが読み込まれたときに実行する初期化処理
  document.addEventListener('DOMContentLoaded', event => {
    // HTML要素の取得
    let connectButton = document.querySelector("#connect"); // 接続ボタン
    let statusDisplay = document.querySelector('#status'); // ステータス表示
    let Slider0 = document.querySelector('#dx0'); //a0スライダー
    let Slider1 = document.querySelector('#dx1'); 
    let Slider2 = document.querySelector('#dx2'); 
    let Slider3 = document.querySelector('#dx3'); 
    let Slidera = document.querySelector('#dxa'); 
    let Sliderb = document.querySelector('#dxb'); 
    let Sliderc = document.querySelector('#dxc'); 
    let Sliderp = document.querySelector('#dxp'); 
    let port; // シリアルポート

    // シリアルポートに接続する関数
    function connect() {
      port.connect().then(() => {
        statusDisplay.textContent = ''; // ステータス表示をクリア
        connectButton.textContent = 'Disconnect'; // ボタンのテキストを変更

        // データ受信時の処理(デコードしてコンソールに出力)
        port.onReceive = data => {
          let textDecoder = new TextDecoder();
          console.log(textDecoder.decode(data));
        }
        // データ受信エラー時の処理
        port.onReceiveError = error => {
          console.error(error);
        };
      }, error => {
        statusDisplay.textContent = error; // エラーをステータス表示に出力
      });
    }

    // スライダーの値が変更されたときにシリアルポートにデータを送信する関数
    function onUpdate() {
      if (!port) {
        return;
      }

      let view = new Uint8Array(8);
      view[0] = parseInt(Slider0.value); // a0のスライダーの値を取得
      view[1] = parseInt(Slider1.value);
      view[2] = parseInt(Slider2.value); 
      view[3] = parseInt(Slider3.value); 
      view[4] = parseInt(Slidera.value); 
      view[5] = parseInt(Sliderb.value); 
      view[6] = parseInt(Sliderc.value); 
      view[7] = parseInt(Sliderp.value); 
      port.send(view); // データをシリアルポートに送信
    };

    // スライダーの値が変更されたときに onUpdate 関数を呼び出すイベントリスナーを追加
    Slider0.addEventListener('input', onUpdate);
    Slider1.addEventListener('input', onUpdate);
    Slider2.addEventListener('input', onUpdate);
    Slider3.addEventListener('input', onUpdate);
    Slidera.addEventListener('input', onUpdate);
    Sliderb.addEventListener('input', onUpdate);
    Sliderc.addEventListener('input', onUpdate);
    Sliderp.addEventListener('input', onUpdate);
    
    // 接続ボタンがクリックされたときの処理
    connectButton.addEventListener('click', function() {
      if (port) {
        port.disconnect(); // 接続を切断
        connectButton.textContent = 'Connect'; // ボタンのテキストを変更
        statusDisplay.textContent = ''; // ステータス表示をクリア
        port = null; // ポートをリセット
      } else {
        // シリアルポートの選択を要求
        serial.requestPort().then(selectedPort => {
          port = selectedPort;
          connect(); // 選択されたポートに接続
        }).catch(error => {
          statusDisplay.textContent = error; // エラーをステータス表示に出力
        });
      }
    });

    // 利用可能なシリアルポートを取得して接続を試みる
    serial.getPorts().then(ports => {
      if (ports.length == 0) {
        statusDisplay.textContent = 'No device found.'; // デバイスが見つからない場合
      } else {
        statusDisplay.textContent = 'Connecting...'; // 接続を試みる場合
        port = ports[0];
        connect(); // 最初に見つかったポートに接続
      }
    });
  });
})();
