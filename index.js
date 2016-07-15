'use strict';

const TableUtils = require('./lib/util');

class StorageTable {
	constructor(table) {
		this.table = table;
		this.storage = [];
		this.place = [];
	}

	convert() {
		if (!this.table)
			return;
		if (!this.table.children)
			return;
		var rows = TableUtils.fixedTableRows(this.table);
		for (var i = 0; i < rows.length; i++) {
			var index = 0;
			for (var j = 0; j < rows[i].cells.length; j++) {
				var oIndex = index;
				var cell = rows[i].cells[j];
				if (!this.storage[i])
					this.storage[i] = [];
				if (this.storage[i][index] === null) {
					var wIndex = index;
					while (this.storage[i][wIndex] === null)
						wIndex++;
					this.storage[i][wIndex] = cell;
					var max = 0;
					for (var b = 0; b < this.storage[i].length; b++) {
						if (this.storage[i][b] !== null && this.storage[i][b] !== undefined)
							max = b;
					}
					oIndex = index = max;
				} else {
					this.storage[i][index] = cell;
				}
				if (parseInt(cell.rowSpan) > 1 || parseInt(cell.colSpan) > 1) {
					if (!this.place[i])
						this.place[i] = [];
					this.place[i].push(cell);
				}

				if (parseInt(cell.colSpan) > 1) {
					for (var m = 1; m <= parseInt(cell.colSpan) - 1; m++) {
						this.storage[i][index + m] = null;
					}
					index = index + parseInt(cell.colSpan);
				} else
					index++;
				if (parseInt(cell.rowSpan) > 1) {
					for (var n = 1; n <= parseInt(cell.rowSpan) - 1; n++) {
						if (!this.storage[i + n]) {
							this.storage[i + n] = [];
						}
						for (var m = 0; m < parseInt(cell.colSpan); m++) {
							this.storage[i + n][oIndex + m] = null;
						}
					}
				}
			}
		}
		return this;
	}

	getCellIndex(ele) {
		if (ele) {
			// 单元格所在行号
			var rowIndex = TableUtils.fixedRowIndex(ele.parentNode);
			// 单元格对应下标
			var index = null;
			// 遍历单元格
			for (var i = 0; i < this.storage[rowIndex].length; i++) {
				// 查询出对应的单元格
				if (ele == this.storage[rowIndex][i]) {
					// 获取对应的单元格下标
					index = rowIndex + "_" + i;
					break;
				}
			}
			return index;
		}
		return undefined
	}
}

module.exports = StorageTable;