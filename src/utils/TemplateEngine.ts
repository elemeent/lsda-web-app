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

export async function renderTemplate(template: string, data: unknown) {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}
