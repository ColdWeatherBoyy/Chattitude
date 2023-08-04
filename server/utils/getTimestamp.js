module.exports = {
	getTimestamp: function () {
		const time = new Date();
		const hours = time.getHours();
		const minutes = time.getMinutes();
		const seconds = time.getSeconds().toString().padStart(2, "0");
		const timestamp = `${hours}:${minutes}:${seconds}`;
		return timestamp;
	},
};
