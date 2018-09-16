/*** Created by Mishok on 2016.*/
	//Check warField
	function cWA(a) {
		let z=0;
		for (let i = 0;i < a.length; i++) {
			for (let j = 0;j < a.length; j++) {
				if (a[i][j] === 1) {
					z+=1;
				}
			}
		}
		return z;
	}
	//reDrawing field
	function drawing(wF1,wF2) {
		document.body.innerHTML = '';
		let holder1 = document.createElement('table');
		let holder2 = document.createElement('table');
		for (let i = 0; i < wF1.length; i++) {
			let tr1 = document.createElement('tr');
			let tr2 = document.createElement('tr');
			holder1[i] = [];
			holder2[i] = [];
			for (let j = 0; j < wF1.length; j++) {
				let td1 = document.createElement('td');
				let td2 = document.createElement('td');
                td1.setAttribute("id", ''+i+j);
                td2.setAttribute("id", ''+i+j);
				td2.setAttribute("class", "droppable");
				holder1[i][j] = wF1[i][j];
				holder2[i][j] = wF2[i][j];
				if(holder1[i][j] == 1) {
					td1.style.backgroundColor = '#ff0000';
				}
				else {
					if (holder1[i][j] == 0) {
						td1.style.backgroundColor = '#6600ff';
					}
					else {
						td1.style.backgroundColor = '#66ccff';
					}
				}
				if(holder2[i][j].ship == 1) {
					let divShip = document.createElement("div");
					divShip.setAttribute("class", "draggable");
					divShip.setAttribute("iddeck", holder2[i][j].ID);
					td2.appendChild(divShip);
				}
				else {
					if (holder2[i][j] == 1) {
						td2.style.backgroundColor = '#ff0000';
					}
					else {
						if(holder2[i][j] == 0) {
							td2.style.backgroundColor = '#6600ff';
						}
						else {
							td2.style.backgroundColor = '#66ccff';
						}

					}
				}
				tr1.appendChild(td1);
				tr2.appendChild(td2);
			}
			holder1.appendChild(tr1);
			holder1.setAttribute("Id", "bot");

			holder2.appendChild(tr2);
			holder2.setAttribute("Id", "player");
		}


		let divbot = document.createElement("div");
		divbot.setAttribute("id", "notdrag");
		divbot.appendChild(holder1);
		let divplayer = document.createElement("div");
		divplayer.setAttribute("id", "redips-drag");
		divplayer.appendChild(holder2);
		let divwarfilds = document.createElement("div");
		divwarfilds.setAttribute("id", "warfilds");
		divwarfilds.appendChild(divbot);
		divwarfilds.appendChild(divplayer);
		document.body.appendChild(divwarfilds);
	}

	//Generator binary. 1 If the orientation is vertical, otherwise horizontal.
	function getRandomBinary() {
		let rend = Math.random();
		if (rend < 0.5) {return 0;}
		else {return 1;}
	}

	//Generator random coordinates from 0 to 9.
	function getRandomCoor() {
    	return Math.floor(Math.random() * 10);
	}
	
	function returnRandomWarField () {


	//A function of creation decks of the ship's coordinates. The randomly coordinate the first deck and random orientation.
		function shipdeck(deck) {
			let d = getRandomBinary();
			//console.log(d);
			let c0 = getRandomCoor();
			//console.log(c0);
			let c1 = getRandomCoor();
			//console.log(c1);

			let deck4mass = [];
			let temp = c0;
			if (d === 1) {
				for (let i = 0; i < deck; i++) {
					deck4mass[i] = [];
					c0 = temp;
					for (let j = 0; j < 2; j++) {
						deck4mass[i].push(c0);
						c0 = c1 + i;
					}
				}
			}

			else {
				for (let i = 0; i < deck; i++) {
					deck4mass[i] = [];
					c0 = temp + i;
					for (let j = 0; j < 2; j++) {
						deck4mass[i].push(c0);
						c0 = c1;
					}
				}
			}
			for (let k = 0; k < deck4mass.length; k++) {
				for (let l = 0; l < deck4mass[k].length; l++) {
					if (deck4mass[k][l] > 9) {
						return shipdeck(deck);
					}
				}
			}
			return deck4mass;
		}

	//The function checks does not touch or ships if not then returns the merged array of coordinates of all ships.
		function accumNewShips(a, b) {
			for (let i = 0, j = 0; i < a.length; i++) {
				let a0 = a[i][j];
				let a1 = a[i][j + 1];
				for (let k = 0, l = 0; k < b.length; k++) {
					let b0 = b[k][l];
					let b1 = b[k][l + 1];

					if ((a0 === b0 && a1 === b1) ||
							(a0 === b0 && a1 === b1 + 1) ||
							(a0 === b0 && a1 === b1 - 1) ||
							(a0 === b0 + 1 && a1 === b1) ||
							(a0 === b0 - 1 && a1 === b1) ||
							(a0 === b0 - 1 && a1 === b1 + 1) ||
							(a0 === b0 + 1 && a1 === b1 - 1) ||
							(a0 === b0 - 1 && a1 === b1 - 1) ||
							(a0 === b0 + 1 && a1 === b1 + 1)) {
						return accumNewShips(a, shipdeck(b.length));
					}
				}
			}
			return b;
		}

	//The function writes all the coordinates on the field
		function getSeaBattle(mas, ship, deck, ss) {
			for (let i = 0, j = 0; i < ship.length; i++) {
				let x = ship[i][j];
				let y = ship[i][j + 1];
				mas[x][y] = {
					ship: true,
					DEck: deck,
					ID: "" + deck + ss
					//message1: 'Shooting!',
					//message2: 'You Sunk me'
				}
			}
			return mas;
		}

		let arr = [];
		let SIZE_ARR = 10;
		for (let i = 0; i < SIZE_ARR; i++) {
			arr[i] = [];
			for (let j = 0; j < SIZE_ARR; j++) {
				arr[i].push(i + ';' + j);
			}
		}

		let shipcount = 0;
		const shiplist = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
		let temp = shipdeck(shiplist[0]);
		arr = getSeaBattle(arr, temp, shiplist[0], 0);
		let s = 1;
		do {
			let endShip = accumNewShips(temp, shipdeck(shiplist[s]));
			arr = getSeaBattle(arr, endShip, shiplist[s], s);
			shipcount++;
			s++;
			temp = temp.concat(endShip);
		}
		while (shipcount <= 9);
		return arr;
	}
	
	const arrBot = returnRandomWarField();
	
	const arrGamer = returnRandomWarField();
	
	//console.table(arrBot);
	//console.table(arrGamer);
	drawing(arrBot,arrGamer);

	//write void after shooting
    function voidd(mass, co) {
        //console.table(co);
        for (let i = 0, j = 0; i < co.length; i++) {
            let x = co[i][j];
            let y = co[i][j + 1];
            //console.log(x,y);
            if ((mass[x - 1] !== undefined) && (mass[x - 1][y - 1] !== 1)) {
                mass[x - 1][y - 1] = 0;
            }
            if ((mass[x + 1] !== undefined) && (mass[x + 1][y + 1] !== 1)) {
                mass[x + 1][y + 1] = 0;
            }
            if ((mass[x - 1] !== undefined) && (mass[x - 1][y + 1] !== 1)) {
                mass[x - 1][y + 1] = 0;
            }
            if ((mass[x + 1] !== undefined) && (mass[x + 1][y - 1] !== 1)) {
                mass[x + 1][y - 1] = 0;
            }
            if ((mass[x][y + 1] !== undefined) && (mass[x][y + 1] !== 1)) {
                mass[x][y + 1] = 0;
            }
            if ((mass[x][y - 1] !== undefined) && (mass[x][y - 1] !== 1)) {
                mass[x][y - 1] = 0;
            }
            if ((mass[x + 1] !== undefined) && (mass[x + 1][y] !== 1)) {
                mass[x + 1][y] = 0;
            }
            if ((mass[x - 1] !== undefined) && (mass[x - 1][y] !== 1)) {
                mass[x - 1][y] = 0;
            }
        }
        return mass;
    }
	
	function Gamer(a) {
		this.mas = [];
		this.deck = 0;
		this.shootedCoor = [];

		this.shoot = function (c0,c1) {
			if (a[c0][c1].ship === true) {
				//alert('You hit him in coordinatos ' + c0 + ";" + c1);
				this.deck = a[c0][c1].DEck;
				a[c0][c1] = 1;
				this.mas = a;
				let co = [];
				for (let i = 0; i < 1; i++) {
					co[i] = [];
					for (let j = 0; j < 2; j++) {
						co[i].push(c0);
						c0 = c1;
					}
				}
				//console.table(co);
				this.shootedCoor.push(co[0]);
				//console.table(this.shootedCoor);
				if (this.deck > 0 && this.shootedCoor.length === this.deck) {
					drawing(arrBot,arrGamer);
					alert('You Sunk him ' + this.deck + ' deck ship');
					this.mas = voidd(this.mas, this.shootedCoor);
					this.shootedCoor = [];
				}
			}
			else {
				//alert('You do not hit in coordinatos ' + c0 + ";" + c1);
				this.deck = 0;
				a[c0][c1] = 0;
				this.mas = a;
			}
		}
	}

	var gamer = new Gamer(arrBot);

	function WarBot(a) {
		this.mas = [];
		this.deck = 0;
		this.shootedCoor = [];
		this.multiDeckShootReg = false;

		function predictor(mass, co) {
			function sortNumMass(a) {
				for (let i = 0; i < a.length - 1; i++)
					for (let j = i + 1; j < a.length; j++) {
						if (a[i][1] > a[j][1] || a[i][0] > a[j][0]) {
							let temp = a[i];
							a.splice(i, 1, a[j]);
							a.splice(j, 1, temp);
						}
					}
				return a;
			}
			//console.table(co);
			let hv = getRandomBinary();
			let lrud = getRandomBinary();
			if (co.length === 1) {
				let x = co[0][0];
				let y = co[0][1];
				//console.log(x,y);
				if (hv === 0) { //Hor
					if (lrud === 0) { //HorLeft
						if (x - 1 < 0 || mass[x - 1][y] === 0) {
							return predictor(mass, co);
						}
						return [[x - 1, y]];
					}
					else {  //HorRight
						if (x + 1 > 9 || mass[x + 1][y] === 0) {
							return predictor(mass, co);
						}
						return [[x + 1, y]];
					}
				}
				else { //Ver
					if (lrud === 0) { //VerUp
						if (y + 1 > 9 || mass[x][y + 1] === 0) {
							return predictor(mass, co);
						}
						return [[x, y + 1]];
					}
					else {  //VerDown
						if (y - 1 < 0 || mass[x][y - 1] === 0) {
							return predictor(mass, co);
						}
						return [[x, y - 1]];
					}
				}
			}
			else {
				if (co.length === 2) {
					let newCo = sortNumMass(co);
					let x0 = newCo[0][0];
					let y0 = newCo[0][1];
					let x1 = newCo[1][0];
					let y1 = newCo[1][1];
					if (y0 === y1) {
						if (lrud === 0) {
							if (x0 - 1 < 0 || mass[x0 - 1][y0] === 0) {
								return [[x1 + 1, y1]];
							}
							else {
								return [[x0 - 1, y0]];
							}
						}
						else {
							if (x1 + 1 > 9 || mass[x1 + 1][y1] === 0) {
								return [[x0 - 1, y0]];
							}
							else {
								return [[x1 + 1, y1]];
							}
						}
					}
					else {
						if (lrud === 0) {
							if (y0 - 1 < 0 || mass[x0][y0 - 1] === 0) {
								return [[x1, y1 + 1]];
							}
							else {
								return [[x0, y0 - 1]];
							}
						}
						else {
							if (y1 + 1 > 9 || mass[x1][y1 + 1] === 0) {
								return [[x0, y0 - 1]];
							}
							else {
								return [[x1, y1 + 1]];
							}
						}
					}
				}
				else {
					let newCo = sortNumMass(co);
					let x0 = newCo[0][0];
					let y0 = newCo[0][1];
					let x2 = newCo[2][0];
					let y2 = newCo[2][1];
					if (y0 === y2) {
						if (lrud === 0) {
							if (x0 - 1 < 0 || mass[x0 - 1][y0] === 0) {
								return [[x2 + 1, y2]];
							}
							else {
								return [[x0 - 1, y0]];
							}
						}
						else {
							if (x2 + 1 > 9 || mass[x2 + 1][y2] === 0) {
								return [[x0 - 1, y0]];
							}
							else {
								return [[x2 + 1, y2]];
							}
						}
					}
					else {
						if (lrud === 0) {
							if (y0 - 1 < 0 || mass[x0][y0 - 1] === 0) {
								return [[x2, y2 + 1]];
							}
							else {
								return [[x0, y0 - 1]];
							}
						}
						else {
							if (y2 + 1 > 9 || mass[x2][y2 + 1] === 0) {
								return [[x0, y0 - 1]];
							}
							else {
								return [[x2, y2 + 1]];
							}
						}
					}
				}
			}
		}

		this.shoot = function () {
			if (this.deck > 0 && this.shootedCoor.length === this.deck) {
				alert('Bot Sunk you ' + this.deck + ' deck ship');
				this.mas = voidd(this.mas, this.shootedCoor);
				this.shootedCoor = [];
				this.multiDeckShootReg = false;
			}
			else {
				if (this.multiDeckShootReg === true) {
					let newCoor = predictor(this.mas,this.shootedCoor);
					var c0 = newCoor[0][0];
					var c1 = newCoor[0][1];
					//console.log(c0,c1);
					if (a[c0][c1].ship === true) {
						//alert('Bot hit you in coordinatos ' + c0 + ";" + c1);
						this.deck = a[c0][c1].DEck;
						a[c0][c1] = 1;
						this.mas = a;
						this.multiDeckShootReg = true;
						let co = [];
						for (let i = 0; i < 1; i++) {
							co[i] = [];
							for (let j = 0; j < 2; j++) {
								co[i].push(c0);
								c0 = c1;
							}
						}
						this.shootedCoor.push(co[0]);
					}
					else {
						//alert('Bot do not hit in coordinatos ' + c0 + ";" + c1);
						this.deck = 0;
						a[c0][c1] = 0;
						this.mas = a;
					}
				}
				else {
                    c0 = getRandomCoor();
					c1 = getRandomCoor();
					if (a[c0][c1].ship === true) {
						if (a[c0][c1].DEck === 1) {
							//alert('Bot hit you in coordinatos ' + c0 + ";" + c1);
							this.deck = 1;
							a[c0][c1] = 1;
							this.mas = a;
							let co = [];
							for (let i = 0; i < 1; i++) {
								co[i] = [];
								for (let j = 0; j < 2; j++) {
									co[i].push(c0);
									c0 = c1;
								}
							}
							this.shootedCoor = co;
						}
						else {
							//alert('Bot hit you in coordinatos ' + c0 + ";" + c1);
							this.deck = a[c0][c1].DEck;
							this.multiDeckShootReg = true;
							a[c0][c1] = 1;
							this.mas = a;
							let co = [];
							for (let i = 0; i < 1; i++) {
								co[i] = [];
								for (let j = 0; j < 2; j++) {
									co[i].push(c0);
									c0 = c1;
								}
							}
							this.shootedCoor = co;
						}
					}
					else {
						if (a[c0][c1] === 0 || a[c0][c1] === 1) {
							return this.shoot();
						}
						else {
							//alert('Bot do not hit in coordinatos ' + c0 + ";" + c1);
							this.deck = 0;
							a[c0][c1] = 0;
							this.mas = a;

						}
					}
				}
			}
		}
	}

	var bot = new WarBot(arrGamer);

	var result = confirm('Are You want that Bob has made a shot the first? If you choose OK, you can not correct the location of your decks.');
	var max_id;

	setTimeout(function go(result){
		if (cWA(gamer.mas) === 20 || cWA(bot.mas) === 20) {
			drawing(arrBot,arrGamer);
			//console.table(arrBot);
			//console.table(arrGamer);
			if (cWA(gamer.mas) === 20) {alert('Game Over! You Win');}
			else {alert('Game Over! Bot Win');}
			max_id = setTimeout(function () {});
			while (max_id--) {
				clearTimeout(max_id);
			}
			if(confirm('Are you want restart game?')) location.reload();
        }
		else {

			if(result == 0)  {
				let table = document.getElementById('bot');
				table.addEventListener('click',function (event) {
                    let target = event.target;
                    target = target.id;
                    if (!target) return;
                    //console.log(target);
                    let x = +target[0];
                    let y = +target[1];
                    //console.log(x,y);
                    if(arrBot[x][y] === 0 || arrBot[x][y] === 1) {
                        setTimeout(go,500,result);
                    }
                    else {
						document.removeEventListener('mousemove', DragManager.mouseM, false);
						gamer.shoot(x,y);
                        if(gamer.deck > 0) {result = 0;}
                        else{result = 1;}
                        drawing(arrBot,arrGamer);
                        //console.table(arrBot);
                        //console.table(arrGamer);
                        setTimeout(go,500,result);
                    }
                });
			}
			else {
				document.removeEventListener('mousemove', DragManager.mouseM, false);
				bot.shoot();
				if(bot.deck > 0) {result = 1;}
				else{result = 0;}
				drawing(arrBot,arrGamer);
				//console.table(arrBot);
				//console.table(arrGamer);
				setTimeout(go,500,result);
			}
		}
	},1000,result);


