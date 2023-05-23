
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

var recognition = new SpeechRecognition();
recognition.lang = 'ja-JP';  // 日本語に設定
recognition.interimResults = false;  // 音声認識終了まで結果を返さない
recognition.maxAlternatives = 1;  // 候補を1つに限定

document.querySelector('#btn').addEventListener('click', function () {
	recognition.start();
	// 10秒後に音声認識を終了
	setTimeout(function () { recognition.stop(); }, 10000);
});

recognition.addEventListener('result', function (e) {
	var transcript = e.results[0][0].transcript;
	// 半角スペースで区切られた単語を配列に変換
	var words = transcript.split(' ');

	// 各食材の入力フィールドに最大4つまで単語を入力
	for (var i = 0; i < Math.min(4, words.length); i++) {
		document.querySelector('#ingredient-' + (i + 1)).value = words[i];
	}
});

// 音声入力ここまで


// 楽天APIここから

$(document).ready(function () {
	$("#ingredients-form").on("submit", function (event) {
		event.preventDefault();

		let ingredients = [];
		for (let i = 1; i <= 4; i++) {
			let val = $(`#ingredient-${i}`).val();
			if (val) ingredients.push(val);
		}

		$("#results-div").empty();

		ingredients.forEach(ingredient => {
			let xhr = new XMLHttpRequest();
			let url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?applicationId=1023393024377346596&categoryId=30&keyword=${encodeURIComponent(ingredient)}`;
			xhr.open('GET', url, true);
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					let data = JSON.parse(this.responseText);
					let randomRecipe = data.result[Math.floor(Math.random() * data.result.length)];

					$("#results-div").append(`<div class="recipe-card">
        				<h2>${randomRecipe.recipeTitle}</h2>
    					</div>
						`);



					$("#re-btn").hide();
					console.log(randomRecipe.recipeUrl);
					var target = document.createElement("a");
					target.href = randomRecipe.recipeUrl;
					target.target = "_blank";
					target.textContent = "recipe";
					target.classList.add("recipe-link");
					$("#results-div").append(target);

					// レシピリンクのクリックイベントを設定
					$("#results-div").on("click", ".recipe-link", function (event) {
						event.preventDefault(); // デフォルトのリンククリック動作をキャンセル
						const url = $(this).attr("href");
						window.open(url, "_blank"); // 新しいウィンドウまたはタブでリンクを開く
					});




					// $("#re-btn").show();
					// console.log(randomRecipe.recipeUrl);
					// var target = document.getElementById("re-btn");
					// target.href = randomRecipe.recipeUrl;

					// window.open(randomRecipe.recipeUrl, "_blank").focus();


					// // レシピリンクのクリックイベントを設定
					// $("#recipe-results").on("click", ".recipe-link", function (event) {
					// 	event.preventDefault(); // デフォルトのリンククリック動作をキャンセル
					// 	const url = $(this).attr("href");
					// 	window.open(url, "_blank"); // 新しいウィンドウまたはタブでリンクを開く
					// });

					// // re-btn ボタンのクリックイベントを設定
					// $("#re-btn").on("click", function (event) {
					// 	event.preventDefault(); // デフォルトのボタンクリック動作をキャンセル
					// 	const url = randomRecipe.recipeUrl;
					// 	window.open(url, "_blank").focus(); // 新しいウィンドウまたはタブでリンクを開く
					// 	console.log(randomRecipe.recipeUrl);
					// });


				}
			};
			xhr.send();
		});
	});
});



