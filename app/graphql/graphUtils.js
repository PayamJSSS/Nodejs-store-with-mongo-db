const { Kind } = require("graphql");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../functions/tokenGenerator");
const { userModel } = require("../models/user");
const createError = require("http-errors");
function parseObject(valueNode) {
  const value = Object.create(null);
  valueNode.fields.forEach((field) => {
    value[field.name.value] = parseValueNode(field.value);
  });
  return value;
}

function parseValueNode(valueNode) {
  switch (valueNode.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return valueNode.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(valueNode.value);
    case Kind.OBJECT:
      return parseObject(valueNode.value);
    case Kind.LIST:
      return valueNode.values.map((item) => parseValueNode(value));
    default:
      return null;
  }
}
function parseLiteral(valueNode) {
  switch (valueNode.kind) {
    case Kind.STRING:
      return valueNode.value.charAt(0) === "{"
        ? JSON.parse(valueNode.value)
        : valueNode.value;
    case Kind.INT:
    case Kind.FLOAT:
      return Number(valueNode.value);
    case Kind.OBJECT:

    default:
      break;
  }
}

const verifyAccessTokenInGraphQL = async (req) => {
  try {
    const [Bearer, token] = req?.headers?.authorization.split(" ");

    const { mobile } = jwt.verify(token, SECRET_KEY);
    const user = await userModel.findOne({ mobile });
    if (!user) throw createError.Unauthorized("کاربری یافت نشد");
    return user;
  } catch (error) {
    createError.Unauthorized();
  }
};

module.exports = {
  verifyAccessTokenInGraphQL,
};
