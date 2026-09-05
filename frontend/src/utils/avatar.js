// Shared so Navbar and PostCard render the same initial for the same user
// instead of each re-implementing the same one-liner.
export const getInitial = (username) => (username ? username.charAt(0).toUpperCase() : '?');
