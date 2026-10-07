function publicUser(user) {
  // never send password hashes back through the api.
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function makeId(value) {
  // turn names into url-friendly ids, with a fallback for all-punctuation input.
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `record-${Date.now()}`
  );
}

module.exports = { makeId, publicUser };
