	"use strict";

	class PinGame {

		constructor() {

			this.clearPin 			= this.clearPin.bind(this);
			this.resetPins 			= this.resetPins.bind(this);
			this.buttonClick 		= this.buttonClick.bind(this);
			this.checkMatchs 		= this.checkMatchs.bind(this);
			this.addToHistoric 		= this.addToHistoric.bind(this);
			this.generateButtons 	= this.generateButtons.bind(this);
			this.addPinListeners 	= this.addPinListeners.bind(this);

			this.availableColors = [
				'#E7C901',
				'#00D8E7',
				'#E70000',
				'#E70096',
				'#7A00E7',
				'#0017E7',
				'#E77300',
				'#02E700',
				'#343A40',
				'#4F2300',
			];

			this.try = 10;

			this.password = [];

			this.pin_lock = false;
			this.pin_list = [];
			this.pin_container = document.querySelectorAll('.pin_container .pin');

			this.historic = document.querySelector('.historic');

			this.generatePassword();
			this.generateButtons();
			this.addPinListeners();

			console.log(this.password);
		}

		updatePins() {
			for (let i = 0; i < this.pin_container.length; i++) {
				let color = this.pin_list[i];

				this.pin_container[i].style.backgroundColor = color || '#bbb';
			}
		}

		addToHistoric(pins, matchs) {

			// ROWS
			let row = document.createElement('div');
				row.className = 'row';

			let pins_list = document.createElement('div');
				pins_list.className = 'pins';

			// PIN
			pins.map(color => {
				let pin = document.createElement('div');
					pin.className = 'pin';
					pin.style.backgroundColor = color;

				pins_list.appendChild(pin);
			});

			row.appendChild(pins_list);

			// MATCHS
			let match_info = [
				{ color: 'transparent'}, 
				{ title: "Color match", color: '#fff'}, 
				{ title: "Position match", color: '#353535'}
			];

			let matchs_list = document.createElement('div');
				matchs_list.className = 'matchs';

			matchs.map(type => {
				let match = document.createElement('div');
					match.className = 'match';
					match.style.backgroundColor = match_info[type].color;

				if ( type > 0 ) {
					match.style.borderColor = match_info[type].color;
					match.title = match_info[type].title;
				}

				matchs_list.appendChild(match);
			});

			row.appendChild(matchs_list);

			this.historic.insertBefore(row, this.historic.firstChild);
		}

		checkMatchs() {

			this.try--;

			let matchs = [];

			this.pin_list.map((color, index) => {

				if ( color === this.password[index] ) {
					matchs.push(2);
				} else if ( this.password.indexOf(color) >= 0 ) {
					matchs.push(1);
				} else {
					matchs.push(0);
				}

			});

			matchs.sort((a, b) => b-a);

			let sum = matchs.reduce((a, b) => a + b, 0);

			if ( sum == 8 ) {

				setTimeout(function () {
					alert('You won!');
				}, 1000);

				this.gameOver = true;
			}

			return matchs;
		}

		resetPins() {
			this.pin_list = [];

			for (let i = 0; i < this.pin_container.length; i++) {
				this.pin_container[i].style.backgroundColor = '#bbb';
			}
		}

		buttonClick(event) {
			if ( ! event.target || this.pin_lock ) {
				return;
			}

			let color = this.availableColors[event.target.getAttribute('color-index')];

			if ( this.pin_list.indexOf(color) >= 0 ) {
				return;
			}

			this.pin_list.push(color);

			this.updatePins();

			// check if all pins are set
			if ( this.pin_list.length != 4 ) {
				return;
			}

			this.pin_lock = true;

			let matchs = this.checkMatchs();

			this.addToHistoric(this.pin_list, matchs);

			this.resetPins();

			if ( this.gameOver ) {
				return;
			}

			if ( ! this.try ) {
				alert('Game Over!');
				return;
			}

			this.pin_lock = false;
		}

		clearPin(event) {
			if ( ! event.target ) {
				return;
			}

			let index = event.target.getAttribute('index');
			this.pin_list.splice(index, 1);

			this.updatePins();
		}

		addPinListeners() {
			for (let i = 0; i < this.pin_container.length; i++) {
				let pin = this.pin_container[i];
					pin.setAttribute('index', i);
					pin.addEventListener('click', this.clearPin);
			}
		}

		generatePassword() {
			while (this.password.length != 4) {
				
				let color = this.getRandomColor();

				if ( this.password.indexOf(color) >= 0 ) {
					continue;
				}

				this.password.push(color);
			}
		}

		generateButtons() {
			let buttons_container = document.querySelector('.buttons_container');

			this.availableColors.map((color, index) => {

				let button = document.createElement('div');
					button.className = 'button';
					button.style.backgroundColor = color;
					button.setAttribute('color-index', index);
					button.addEventListener('click', this.buttonClick);

				buttons_container.appendChild(button);
			});
		}

		getRandomColor() {
			return this.availableColors[Math.floor(Math.random() * this.availableColors.length)];
		}
	}