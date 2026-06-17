import Handlebars from "handlebars";

Handlebars.registerHelper("math", function (lvalue, operator, rvalue) {
  if (isNaN(lvalue) || isNaN(rvalue)) {
    return "Invalid operands";
  }

  switch (operator) {
    case "+":
      return (Number(lvalue) + Number(rvalue)).toString();
    case "-":
      return (Number(lvalue) - Number(rvalue)).toString();
    case "*":
      return (Number(lvalue) * Number(rvalue)).toString();
    case "/":
      return (Number(lvalue) / Number(rvalue)).toString();
    case "%":
      return (Number(lvalue) % Number(rvalue)).toString();
    default:
      return "Invalid operator";
  }
});

Handlebars.registerHelper("checkbox", function (value) {
  if (true == value || (null != value && Object.keys(value).length > 0))
    return "X";

  return " ";
});

Handlebars.registerHelper("zeroFill", function (value, size) {
  return new Array(size - value.length + 1).join("0") + value;
});

Handlebars.registerHelper("lastTwo", function (value) {
  const strValue = String(value);
  return strValue.length <= 2 ? strValue : strValue.slice(-2);
});

Handlebars.registerHelper("getOrdinal", function (value) {
  const num = parseInt(value, 10);
  if (num === 0) return "";
  if (num % 100 >= 11 && num % 100 <= 13) return `${num}th`;
  switch (num % 10) {
    case 1:
      return `${num}st`;
    case 2:
      return `${num}nd`;
    case 3:
      return `${num}rd`;
    default:
      return `${num}th`;
  }
});

Handlebars.registerHelper("toRoman", function (value) {
  let n = parseInt(String(value), 10);
  if (isNaN(n) || n <= 0 || n > 3999) return String(value);
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      result += syms[i];
      n -= vals[i];
    }
  }
  return result;
});

Handlebars.registerHelper("nl2br", function (value) {
  const escaped = Handlebars.escapeExpression(String(value ?? ""));
  return new Handlebars.SafeString(escaped.replace(/\n/g, "<br>"));
});

export async function renderTemplate(template: string, data: unknown) {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}
