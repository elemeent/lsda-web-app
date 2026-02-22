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

export async function renderTemplate(template: string, data: unknown) {
  const compiled = Handlebars.compile(template);
  return compiled(data);
}
