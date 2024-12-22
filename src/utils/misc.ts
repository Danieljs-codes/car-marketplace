export const getAvatarInitials = (name: string) => {
	const [firstName, lastName] = name.split(" ");

	if (firstName[0].toLowerCase() === lastName[0].toLowerCase()) {
		return firstName[0].toUpperCase();
	}

	return `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`;
};
