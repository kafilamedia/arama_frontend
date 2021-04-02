let index = 1;
export const uniqueId = function () {
	let string = new String(new Date().getUTCMilliseconds()).toString();
	index++;
	return index + "-" + string;
}

export function beautifyNominal(val:any) {
	if (val == "" || val == null) return "0";
	const isDecimal:boolean = new String(val).includes(".");
	const isNegative:boolean = new String(val).startsWith("-");
	if (isNegative) {
		val = new String(val).replace("-","");
	}
	const rawVal = isDecimal? parseInt( new String(val).split(".")[0]) : parseInt(val);
	let nominal = Math.abs(rawVal).toString();
	let result = "";
	if (nominal.length > 3) { 
		let zeroIndex: number = 0;
		for (let i = nominal.length - 1; i > 0; i--) {
			zeroIndex++; 
			result = nominal[i] + result;
			if (zeroIndex == 3 ) {
				result = "." + result;
				zeroIndex = 0;
			}

		}
		result = nominal[0] + result;
	} else {
		result = val;
	}
	if (rawVal < 0) {
		return rawVal;
	}
	if (isDecimal) {
		result+= ","+ new String(val).split(".")[1];
	}
	if (isNegative) {
		result = "-"+result;
	}
	return result;
}
 

const months = [
	"January", "Ferbuary", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December"
]

export const monthYearString = function (m, y) {
	if (m == null || y == null) {
		return "-";
	}
	return months[m - 1] + " " + y;
}
export const twoDigits = (value:number) :string => {
    if (value >= 10) {
        return   value.toString();
    }
    return "0"+value;
}