module.exports = {
	getTimestamp: function () {
		const time = new Date();
		const hours = time.getHours() % 12;
		const minutes = time.getMinutes().toString().padStart(2, "0");
		const seconds = time.getSeconds().toString().padStart(2, "0");
		const timestamp = `${hours}:${minutes}:${seconds}`;
		return timestamp;
	},
};
