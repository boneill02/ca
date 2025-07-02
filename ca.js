/*
 * @file ca.js
 * @brief Cellular automata simulator
 * @author Ben O'Neill <ben@oneill.sh>
 *
 * @copyright Copyright (c) 2022-2025 Ben O'Neill <ben@oneill.sh>.
 * This work is released under the terms of the MIT License. See
 * LICENSE.
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var rows = 60;
var cols = 60;
var cellSize = 10;
var birth = [2, 3];
var survival = [4];
var neighborhood = 3;
var stateCount = 10;
var updateInterval = 100;
var paused = true;

var grid = new Array(rows).fill(null).map(() => new Array(cols).fill(0));

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if (grid[i][j] > 0) {
				ctx.fillStyle = "#fff";
				ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
			}
		}
	}
}

function update(force = false) {
	if (paused && !force) return;
	var newGrid = new Array(rows).fill(null).map(() => new Array(cols).fill(0));
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			var neighbors = countNeighbors(i, j);
			var allNeighbors = countAllNeighbors(i, j);
			if (grid[i][j] > 0) {
				if (survival.includes(neighbors)) {
					newGrid[i][j] = grid[i][j];
				} else {
					if (stateCount > 2)
						newGrid[i][j] = grid[i][j] + 1;
					else
						newGrid[i][j] = 0;
				}
			} else {
				if (birth.includes(neighbors)) {
					newGrid[i][j] = 1;
				}
			}

			if (stateCount > 2 && grid[i][j] > stateCount) {
				newGrid[i][j] = 0;
			}
		}
	}

	grid = newGrid;
}

function countNeighbors(row, col) {
	var count = 0;

	for (var i = neighborhood * -1; i <= neighborhood; i++) {
		for (var j = neighborhood * -1; j <= neighborhood; j++) {
			if (i == 0 && j == 0) continue;

			var x = row + i;
			var y = col + j;
			if (x < 0 || x >= rows || y < 0 || y >= cols) continue;

			if (grid[x][y] == 1) count++;
		}
	}

	return count;
}

function countAllNeighbors(row, col) {
	var count = 0;

	for (var i = neighborhood * -1; i <= neighborhood; i++) {
		for (var j = neighborhood * -1; j <= neighborhood; j++) {
			if (i == 0 && j == 0) continue;

			var x = row + i;
			var y = col + j;
			if (x < 0 || x >= rows || y < 0 || y >= cols) continue;

			if (grid[x][y] > 0) count++;
		}
	}

	return count;
}

function simulate() {
	paused = !paused;
	if (paused) return;
	birth = document.getElementById('birth').value.split(',').map(Number);
	survival = document.getElementById('survival').value.split(',').map(Number);
	neighborhood = parseInt(document.getElementById('neighborhood').value);
	stateCount = parseInt(document.getElementById('stateCount').value);
	updateInterval = parseInt(document.getElementById('updateInterval').value);
}

function toggle() {
	birth = document.getElementById('birth').value.split(',').map(Number);
	survival = document.getElementById('survival').value.split(',').map(Number);
	neighborhood = parseInt(document.getElementById('neighborhood').value);
	stateCount = parseInt(document.getElementById('stateCount').value);
	updateInterval = parseInt(document.getElementById('updateInterval').value);
	paused = !paused;
}

function step() {
	birth = document.getElementById('birth').value.split(',').map(Number);
	survival = document.getElementById('survival').value.split(',').map(Number);
	neighborhood = parseInt(document.getElementById('neighborhood').value);
	stateCount = parseInt(document.getElementById('stateCount').value);
	updateInterval = parseInt(document.getElementById('updateInterval').value);
	update(true);
}

var mouseDown = false;
var mouseX = 0, mouseY = 0;

function mouseClick(e) {
	var rect = canvas.getBoundingClientRect();
	var x = Math.floor( (e.pageX - rect.left) / cellSize );
	var y = Math.floor( (e.pageY - rect.top)  / cellSize );
	mouseX = x;
	mouseY = y;

	if (grid[y][x] > 0) {
		grid[y][x] = 0;
	} else {
		grid[y][x] = 1;
	}
}

canvas.onmousemove = function(e) {
	if (mouseDown) {
		var rect = canvas.getBoundingClientRect();
		var x = Math.floor( (e.pageX - rect.left) / cellSize );
		var y = Math.floor( (e.pageY - rect.top)  / cellSize );
		if (mouseX != x || mouseY != y) {
			mouseClick(e);
		}
	}
}

canvas.onmousedown = function(e) {
	mouseDown = true;
	mouseClick(e);
};
canvas.onmouseup = function(e) {
	if (mouseDown)
	mouseDown = false;
};

setInterval(() => {
	update();
	draw();
}, updateInterval);
