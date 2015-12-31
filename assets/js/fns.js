/****************************************
__
utility function to emulate sprintf
args: pattern (the string)
			tokens (string or array of replacements)
****************************************/
function __(pattern, tokens) {
	var ph = /%s/;

	if (typeof tokens !== 'object') {
		return pattern.replace(ph, tokens);
	} else {
		for (var x = 0; x < tokens.length; x++) {
			pattern = pattern.replace(ph, tokens[x])
		}
		return pattern;
	}
}

/****************************************
rank
function to return the ordinal rank of
a number within a range. Pass third parameter
to return the percentile rather than rank
args: arr (range of numbers)
			num (the number)
			percentile (optional)
****************************************/
function rank(arr, num, percentile) {

	/*if (arr.indexOf(num) == -1 && percentile == undefined) {
		return NaN;
	}*/

	arr.sort(function(a, b) {
		return (a - b);
	})

	var items = arr.length;
	for (var y = 0; y < items; y++) {
		if (num <= arr[y]) {
			return (percentile == true) ? (100 - ((y / items) * 100)) : y + 1;
		}
	}
}