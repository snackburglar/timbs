function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

function makeId(value) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `record-${Date.now()}`
  );
}

module.exports = { makeId, publicUser };
