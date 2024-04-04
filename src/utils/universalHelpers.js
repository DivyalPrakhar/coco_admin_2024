import { Input } from "antd";

// utility to sort table data

export const customSorterString = (a, b) => {
	const serialA = String(a.serial);
	const serialB = String(b.serial);
	return serialA.localeCompare(serialB);
};

// utility to filter table data and row

export const customFilter = (value, record) => {
	return (
		String(record.serial).toLowerCase().includes(value.toLowerCase()) ||
		String(record.package?.en).toLowerCase().includes(value.toLowerCase())
	);
};

// render global search on tables

export function renderGlobalSearch(setSearchedText, debouncedSearch) {
	return (
		<Input.Search
			placeholder="Search"
			onSearch={(value) => {
				setSearchedText(value);
			}}
			onChange={(e) => {
				debouncedSearch(e.target.value);
			}}
		/>
	);
}

// create expiry date by given duration and start date

export const createExpiryDateFromDuration = (startDate = "", duration = 0) => {
	const date = new Date(startDate);
	date.setDate(date.getDate() + duration);
	return date.toISOString();
};
