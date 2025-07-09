const formats = {
	number(n: number): string {
		const abs = math.abs(n);
		let value: number;
		let suffix = "";

		if (abs < 1_000) {
			value = n;
		} else if (abs < 1_000_000) {
			value = n / 1_000;
			suffix = "k";
		} else if (abs < 1_000_000_000) {
			value = n / 1_000_000;
			suffix = "M";
		} else {
			value = n / 1_000_000_000;
			suffix = "B";
		}

		const rounded = math.floor(value * 100) / 100;
		return `${rounded}${suffix}`;
	},
};

export default formats;
