	"use strict";

	class PinGame {

		constructor() {

			this.generateButtons 	= this.generateButtons.bind(this);
			this.buttonClick 		= this.buttonClick.bind(this);
			this.checkMatchs 		= this.checkMatchs.bind(this);
			this.resetPins 			= this.resetPins.bind(this);
			this.addToHistoric 		= this.addToHistoric.bind(this);

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

			this.pin_position = 0;
			this.pin_lock = false;
			this.pin_list = [];
			this.pin_container = document.querySelector('.pin_container');

			this.historic = document.querySelector('.historic');

			this.generatePassword();
			this.generateButtons();
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
			let match_color = ['transparent', '#fff', '#353535'];

			let matchs_list = document.createElement('div');
				matchs_list.className = 'matchs';

			matchs.map(type => {
				let match = document.createElement('div');
					match.className = 'match';
					match.style.backgroundColor = match_color[type];

				if ( type > 0 ) {
					match.style.borderColor = match_color[type];
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

				return false;
			}

			return matchs;
		}

		resetPins() {
			this.pin_list = [];

			let list = this.pin_container.childNodes;
			let i = 0;

			while(i != 8) {
				list[i + 1].style.backgroundColor = '#bbb';
				i += 2;
			}

			this.pin_position = 0;
		}

		buttonClick(event) {
			if ( ! event.target || this.pin_lock ) {
				return;
			}

			let color = this.availableColors[event.target.getAttribute('color-index')];

			if ( this.pin_list.indexOf(color) >= 0 ) {
				return;
			}

			this.pin_container.childNodes[this.pin_position + 1].style.backgroundColor = color;

			this.pin_list.push(color);

			this.pin_position += 2;

			// all pins are set
			if ( this.pin_position == 8 ) {
				this.pin_lock = true;

				let matchs = this.checkMatchs();

				if ( ! matchs ) {
					return;
				}

				this.addToHistoric(this.pin_list, matchs);

				this.resetPins();
			}

			if ( ! this.try ) {
				alert('Game Over!');
				return;
			}

			this.pin_lock = false;
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