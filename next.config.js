/** @type {import('next').NextConfig} */
module.exports = {
  // Turned off the reactStrictMode due to "react-beautiful-dnd - Invariant failed: Cannot
  // find droppable entry with id - not sure why
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};
