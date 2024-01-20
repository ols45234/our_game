var result = [];
var blockNow = {};
var balance = 0;
var gameData = {};
var state = 'waitForRoomId';
var userAnswer = '';
var roomId;
var playersNum = 0;
var lobby = true;
var firstNameFormChage = false;
var teams = [];
var turn =0;
var roomsData = [];
var username = `player${Math.floor(Math.random() * 1000)}`;
var delay = ms => new Promise(res => setTimeout(res, ms));
var flag = false;
var serverIp = 'http://' + window.location.toString().split('/')[2].split(':')[0] + ':8000'

function ask(block) {
	blockNow = block
	questionArea = document.getElementById('question')
	submitButton = document.getElementById('submit')
	answerArea = document.getElementById('answer')

	document.getElementById('table').style.display = 'none';

	questionArea.textContent = `Вопрос: ${block.question}`
	
	questionArea.style.display = 'block'
	submitButton.style.display = 'block'
	answerArea.style.display = 'block'
	document.getElementById('question-div').style.display = 'block'
}

function ask2(block) {
	blockPos = { x: blockNow.pos.x, y: blockNow.pos.y };
	blockNow = block
	questionArea = document.getElementById('question')
	submitButton = document.getElementById('submit2')
	answerArea = document.getElementById('answer')
	document.getElementById('question-image2').src = './images/' + (result[blockPos.x][blockPos.y].image || 'empty.png')
	questionImage = document.getElementById('question-image2')
	document.getElementById('table').style.display = 'none';

	questionArea.textContent = `Вопрос: ${block.question}`
	
	questionArea.style.display = 'block'
	submitButton.style.display = 'block'
	answerArea.style.display = 'block'
	if (result[blockPos.x][blockPos.y].image)
		questionImage.style.display = 'block'
	document.getElementById('question-div').style.display = 'block'
}

function submit_answer() {
	answerElem = document.getElementById('answer')
	buttonElem = document.getElementById('submit')

	userAnswer = answerElem.value.toLowerCase()

	answerElem.style.display = 'none'
	buttonElem.style.display = 'none'
	document.getElementById('question').style.display = 'none'
	document.getElementById('table').style.display = 'inline-table'

	fetchTable('answer')
	
	document.getElementById('question-div').style.display = 'none'

	//document.getElementById('question').textContent = `Вопрос: `
}

function submit_answersolo() {
	answerElem = document.getElementById('answer')
	buttonElem = document.getElementById('submit2')
	let answers
		for (let i = 0; i < teams.length; i++){
			if (teams[i].turnOrder == turn)
				answers = i
		}

	userAnswer = answerElem.value.toLowerCase()
	answerElem.style.display = 'none'
	answerElem.value = ''
	buttonElem.style.display = 'none'
	document.getElementById('question').style.display = 'none'
	document.getElementById('question-image2').style.display = 'none'
	document.getElementById('table').style.display = 'inline-table'
	if (userAnswer == blockNow.answer)
		teams[answers].score += blockNow.cost

	result[blockPos.x][blockPos.y] = undefined

	turn += 1
	if (turn > teams.length)
		turn = 1

	processServerRessolo(gameData)
	
	document.getElementById('question-div').style.display = 'none'
	//document.getElementById('question').textContent = `Вопрос: `
}

async function reply() {
	fetchTable('reply')
}

function getUnicalElements(arr) {
	var output = ""
	arr.forEach(item => {
		if (!output.includes(item))
			output += `${item};`
	});
	output = output.slice(0, -1)
	return output.split(';')
}




function tableCreate(costs, topics) {
	tbl = document.getElementById("table");
	tbl.innerHTML = '' //чистим
	//tbl.style.wrowdth = '100px';
	//tbl.style.border = '1px solrowd black';
	for (let row = 0; row < topics.length + 1; row++) {
		const tr = tbl.insertRow();
		for (let col = 0; col < costs.length + 1; col++) {

			const td = tr.insertCell();
			try {
				if (row != 0 && col != 0 && result[row - 1][col - 1]) {
					var btn = document.createElement("button");
					btn.classList.add("question-select")
					btn.innerHTML = costs[col - 1];
					btn.disabled = !(state == 'waitForSelectThis');
					btn.onclick = function () {
						blockNow.pos = { x: row - 1, y: col - 1 };
						fetchTable('question-select')
					}
					if(!(state == 'waitForSelectThis')){
						btn.classList.add('.button-disabled')
					}

				} else if (row == 0 ^ col == 0) {  // ^ = XOR
					var btn = document.createElement("p");
					btn.innerHTML = `${(row == 0 ? costs[col - 1] : topics[row - 1])}`
					btn.classList.add("table-element")
				} else {
					var btn = document.createTextNode(``);
				}
				//console.log(btn)

				td.appendChild(btn);
				//td.style.border = '1px solid black';
			} catch (err) {
				debugger;
				console.log(err)
			}
		}
	}
	return
}

function tableCreateSolo(costs, topics) {
	tbl = document.getElementById("table");
	tbl.innerHTML = '' //чистим
	//tbl.style.wrowdth = '100px';
	//tbl.style.border = '1px solrowd black';
	for (let row = 0; row < topics.length + 1; row++) {
		const tr = tbl.insertRow();
		for (let col = 0; col < costs.length + 1; col++) {

			const td = tr.insertCell();
			try {
				if (row != 0 && col != 0 && result[row - 1][col - 1]) {
					var btn = document.createElement("button");
					btn.classList.add("question-select")
					btn.innerHTML = costs[col - 1];
					btn.disabled = !(state == 'waitForSelectThis');
					btn.onclick = function () {
						blockNow.pos = { x: row - 1, y: col - 1 };
						processServerRessolo(gameData)
					}
					if(!(state == 'waitForSelectThis')){
						btn.classList.add('.button-disabled')
					}

				} else if (row == 0 ^ col == 0) {  // ^ = XOR
					var btn = document.createElement("p");
					btn.innerHTML = `${(row == 0 ? costs[col - 1] : topics[row - 1])}`
					btn.classList.add("table-element")
				} else {
					var btn = document.createTextNode(``);
				}
				//console.log(btn)

				td.appendChild(btn);
				//td.style.border = '1px solid black';
			} catch (err) {
				debugger;
				console.log(err)
			}
		}
	}
	return
}

function questionSelected(){

}

async function fetchTable(type) {
	//await delay(100)
	//console.log('fetch')
	fetch(`${serverIp}/fetch?${type == 'answer' ? `btnPos=${JSON.stringify(blockNow.pos)}&answer=${userAnswer}&` : ``}id=${roomId}&user=${username}&type=${type}${type == 'question-select' ? `&btnPos=${JSON.stringify(blockNow.pos)}` : ``}`)
		.then(data => data.json())
		.then(async function (data) {
			processServerRes(data)
		})
		.catch(err => { console.log(err); alert('can\'t connect to servers'); debugger; })
}

async function fetchTablesolo(type) {
	//await delay(100)
	//console.log('fetch')
	//console.log(`${serverIp}/fetchsolo?${type == 'answer' ? `btnPos=${JSON.stringify(blockNow.pos)}&answer=${userAnswer}&` : ``}id=${1}&user=${username}&type=${type}${type == 'question-select' ? `&btnPos=${JSON.stringify(blockNow.pos)}` : ``}`)
	fetch(`${serverIp}/fetchsolo?${type == 'answer' ? `btnPos=${JSON.stringify(blockNow.pos)}&answer=${userAnswer}&` : ``}id=${1}&user=${username}&type=${type}${type == 'question-select' ? `&btnPos=${JSON.stringify(blockNow.pos)}` : ``}`)
		.then(data => data.json())
		.then(async function (data) {
			processServerRessolo(data)
		})
		.catch(err => { console.log(err); alert('can\'t connect to servers'); debugger; })
}

async function processServerRessolo(data) {
	try {
		gameData = data;
		result = gameData.result
		tableCreateSolo(gameData.costsList, gameData.topicsList);
		balanceContent = ``
		let answers
		for (let i = 0; i < teams.length; i++){
			balanceContent += `<div class="teambrick" style="background-color:${teams[i].color}; border-color:${teams[i].color}">${teams[i].name.toUpperCase()}: ${teams[i].score}</div>`
			if (teams[i].turnOrder == turn)
				answers = i
		}
		//balanceContent += `Отвечает ${teams[answers].name}`
		document.getElementById('balance').innerHTML = balanceContent //вывод баланса
		document.getElementById('balance').children[answers].classList.add('teambrickselected')
		if (blockNow.pos)
			ask2(result[blockNow.pos.x][blockNow.pos.y])
		let flag = true
		for (let i = 0; i<=3; i++){
			for (let j = 0; j<=4; j++){
				if (gameData.result[i][j] != undefined)
					flag = false
			}
		}
		if (flag == true)
			finishGame()
	} catch(err) {
		console.log(err)
	}
}

async function processServerRes(data) {
	try {
		//debugger;
		playersNum = data.playersNum;
		document.getElementById('marker').textContent = `Ожидание игроков(${playersNum}/${data.maxPlayers})... `

		if (playersNum >= data.maxPlayers && lobby)
			setup()

		gameData = data; //сохраняем
		balance = data.balance; // получаем баланс
		state = data.states[username]
		result = data.result //2д массив 

		if (state == 'waitForWhoAnswering') {
			document.getElementById('reply-div').style.display = 'block'
            document.getElementById('table').style.display = 'none'
            document.getElementById('question-preview').textContent = result[gameData.blockNow.pos.x][gameData.blockNow.pos.y].question
			document.getElementById('question-image').src = './images/' + (result[gameData.blockNow.pos.x][gameData.blockNow.pos.y].image || 'empty.png')
        }
		else
			document.getElementById('reply-div').style.display = 'none'
		if (state == 'waitForSelectOther' || state == 'waitForSelectThis')
			document.getElementById('table').style.display = 'table'

		if (state == 'waitForAnswerThis')
			ask(result[data.blockNow.pos.x][data.blockNow.pos.y])

		//console.log(data)

		balanceContent = `баланс команд: <br>`
		Object.keys(balance).forEach(item => balanceContent += `${item}: ${balance[item]}<br>`)
		document.getElementById('balance').innerHTML = balanceContent //вывод баланса

		tableCreate(data.costsList, data.topicsList); //таблица

		//blockNow = {}; //убираем блок из памяти
		document.getElementById('answer').value = '' //стираем ответ

		await delay(1000)

		if (['waitForSelectOther', 'waitForSelectThis', 'waitForAnswerOther', 'waitForOthers', 'waitForWhoAnswering'].includes(state))
			fetchTable('get')
	} catch(err) {
		console.log(err)
	}
}

function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == variable)
			return pair[1];
	}
	return undefined;
}

function waitForOthers() {
	state = 'waitForOthers'

	document.getElementById('submit_username').style.display = 'none'
	document.getElementById('login').style.display = 'none'

	fetchTable('newPlayer')

	marker = document.getElementById('marker')
	marker.style.display = 'block'
}
function setup() {
	document.getElementById('marker').style.display = 'none'

	fetchTable('get')
	document.getElementById('balance').style.display = 'flex'
	document.getElementById('table').style.display = 'inline-table'

	lobby = false
}

async function apply_username() {
	var un = document.getElementById('username').value;
	var ri = parseInt(document.getElementById('game-id').value, 16);
	
	if(!roomsData[idHash(ri)])
		return alert('ID команды неверный')
	if (!roomsData[idHash(ri)].all.includes(un))
		return alert('Такая команда не существует')
	if (roomsData[idHash(ri)].joined.includes(un))
		return alert('Команда набрана!')
	roomId = ri
	username = un
	waitForOthers()
}

function create_room() {
	hideWeloceElements()
	/*document.getElementById('create-team').style.display = 'inline'
	document.getElementById('team-create-name').style.display = 'inline'
	document.getElementById('information').style.display = 'inline'
	document.getElementById('submit-teams').style.display = 'inline'
	//document.getElementById('text-teams').style.display = 'inline'
	document.getElementById('team').style.display = 'block'*/
	document.getElementById('team').innerHTML = ''
	document.getElementById('team-creating-ui').style.display = 'flex'
	document.getElementById('submit-teams-solo').style.display = 'none'
	document.getElementById('submit-teams').style.display = 'block'
	while(teams.length < 2)
		create_team()
	
}

function create_solo_room() {
	hideWeloceElements()
	/*document.getElementById('create-team').style.display = 'inline'
	document.getElementById('team-create-name').style.display = 'inline'
	document.getElementById('information').style.display = 'inline'
	document.getElementById('submit-teams').style.display = 'inline'
	//document.getElementById('text-teams').style.display = 'inline'
	document.getElementById('team').style.display = 'block'*/
	document.getElementById('team').innerHTML = ''
	document.getElementById('team-creating-ui').style.display = 'flex'
	document.getElementById('submit-teams').style.display = 'none'
	document.getElementById('submit-teams-solo').style.display = 'block'
	while(teams.length < 2)
		create_team()
	
}

function join_room() {

	hideWeloceElements()
	document.getElementById('login').style.display = 'flex'
	document.getElementById('submit_username').style.display = 'block'

	fetch(`${serverIp}/fetch?type=get-all`) //отправляем запрос на создание комнаты
		.then(data => data.json())
		.then(async function (data) {
			roomsData = data
		})
		.catch(err => { console.log(err); alert('can\'t connect to ' + serverIp); debugger; })
	
}

function hideWeloceElements() {
	document.getElementById('start').style.display = 'none'
	document.getElementById('login').style.display = 'none'
	document.getElementById('team-creating-ui').style.display = 'none'
	document.getElementById('select-mode-ui').style.display = 'none'
}

function create_team() {
	//var defaultName = document.getElementById('team-create-name').value;
	var defaultName = 'новая команда'
	var defaultColor = "#00A3FF"
	let teamsNames = []
	var teamName = {
		name:defaultName,
		color:defaultColor,
		score:0,
		turnOrder:0
	}
	for (let i = 0; i <= teams.length; i++){
		if (teams[i])
			teamsNames += teams[i].name
	}
	for(let i = 2; teamsNames.includes(teamName.name); i++) {
		teamName.name = `${defaultName} (${i})`
	}
	teams.push(teamName)
	document.getElementById('team').innerHTML += `
		<div id='div-team:${teamName.name}'>
			<input type='text' value='${teamName.name}' class='team-name-in' maxlength="32" onChange="editTeam('div-team:${teamName.name}', this.value)"  onClick="this.select();">
			<input type='color' value='#00A3FF' class='team-color-in' onChange="editTeam('div-team:${teamName.name}', null, this.value)">
			<button onClick="removeTeam('div-team:${teamName.name}')" class='team-name' id='button-team:${teamName.name}'>&#215;</button>
		</div>
	`
}

function removeTeam(elementID) {
	elem = document.getElementById(elementID);
	teams = teams.filter(item => item != elementID.split(':')[1])
	elem.remove()
}

function editTeam(elementID, defName, defColor) {
	var newname
	let teamsNames = []
	var elem = document.getElementById(elementID);
	if (defName == null)
			newname = elem.children[0].value
	else
		newname = defName
	if (!defColor)
		defColor = elem.children[1].value
	for (let i = 0; i <= teams.length; i++)
	{
		if (teams[i]){
			if (teams[i].name == elementID.split(':')[1]){
				teams[i].name = newname;
				teams[i].color = defColor;
			}
		}
	}
	elem.id = `div-team:${newname}`
	elem.innerHTML = `
		<input type='text' value='${newname}' class='team-name-in' maxlength="32" onChange="editTeam('div-team:${newname}', this.value, null)" onClick="this.select();" style="border-color:${defColor}">
		<input type='color' value='${defColor}' class='team-color-in' onChange="editTeam('div-team:${newname}', null, this.value)" style="border-color:${defColor}; background-color:${defColor}">
		<button onClick="removeTeam('div-team:${newname}')" class='team-name' id='button-team:${newname}' style="border-color:${defColor}; background-color:${defColor}">&#215;</button>
	`
}


function submit_teams() {
	let teamsNames = []
	for (let i = 0; i < teams.length; i++){
		if (teams[i])
			teamsNames.push(teams[i].name)
	}
	fetch(`${serverIp}/fetch?type=create_room&teams=${JSON.stringify(teamsNames)}`) //отправляем запрос на создание комнаты
		.then(data => data.json())
		.then(async function (data) {
			document.getElementById('roomId').style.display = 'block'
			var roomID = data.roomID.toString(16).toUpperCase();
			var link = `${window.location.toString().split('?')[0]}?Id=${roomID}`
			document.getElementById('roomId').innerHTML = `Ваша ссылка для приглашения учасников: <a href=${link}>${link}</a> <button style = 'null' class='na_angliskom' onClick="navigator.clipboard.writeText('${link}')">	
			&#128203;</button> (ваш ID: ${roomID})`
		})
		.catch(err => { console.log(err); alert('can\'t connect to servers'); debugger; })
	document.getElementById('team-creating-ui').style.display = 'none'

}

function startupsolo() {
	let turnorders = []
	for (let i = 1; i <= teams.length; i++){
		turnorders.push(i)
	}
	for (let i = 0; i < teams.length; i++){
		let choose = randInt(0, turnorders.length - 1)
		teams[i].turnOrder = turnorders[choose]
		turnorders.splice(choose, 1);
	}
	turn = 1
	state = 'waitForSelectThis';
	document.getElementById('team-creating-ui').style.display = 'none'
	fetchTablesolo('get')
	document.getElementById('balance').style.display = 'flex'
	document.getElementById('table').style.display = 'inline-table'
	lobby = false
}

function backToMain(divId) {
	teams = []
	hideWeloceElements()
	document.getElementById('game-end').style.display = 'none'
	document.getElementById('start').style.display = 'flex'
}

function finishGame(){
	teams = []
	state = 'waitForRoomId'
	hideWeloceElements()
	document.getElementById('balance').style.display = 'none'
	document.getElementById('table').style.display = 'none'
	document.getElementById('game-end').style.display = 'block'
}

function idHash (id) {
	var level1 = id ^ 0x323B0239 // magic key (password), need sync
	var level2 = level1 / 0xFFFFFFFF
	var level3 = Math.sin(level2 * 90) * 0xFFFFFFFF
	var level4 = Math.floor(level3)
	return level4
}

function select_mode() {
	hideWeloceElements()
	/*document.getElementById('create-team').style.display = 'inline'
	document.getElementById('team-create-name').style.display = 'inline'
	document.getElementById('information').style.display = 'inline'
	document.getElementById('submit-teams').style.display = 'inline'
	//document.getElementById('text-teams').style.display = 'inline'
	document.getElementById('team').style.display = 'block'*/
	document.getElementById('select-mode-ui').style.display = 'flex'
	
}



if(getQueryVariable('Id') != undefined){ 
	roomIdHex = getQueryVariable('Id')
	roomId = parseInt(roomIdHex, 16);
	join_room();
	state = 'waitForUsername';
	document.getElementById('game-id').value = roomIdHex;
	document.getElementById('login-back').style.display = 'none'
	//document.getElementById('username').placeholder = 'введите имя команды'
	//fetchTable('get')
}
//fetchTable('get')

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.round(Math.random() * (max - min)) + min;
}