const rows = 200;
const columns = 200;

const normalizeCropData = (cropData) => {
	const noralizedData = {
		crops: {},
		rows: cropData.length,
		columns: cropData[0] ? cropData[0].length : 0
	};
	cropData.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => noralizedData.crops[`${rowIndex},${columnIndex}`] = cell));
	return noralizedData;
}

export const cropData = [...Array(rows)].map(row => [...Array(columns)].map(cell => ({diseased: Math.random() > 0.8})))

export const normalizedCropData = normalizeCropData(cropData);