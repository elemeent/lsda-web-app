import Handlebars from "handlebars";

Handlebars.registerHelper("math", function (lvalue, operator, rvalue) {
  const expression = `${Number(lvalue)} ${operator} ${Number(rvalue)}`;

  try {
    return eval(expression);
  } catch (e) {
    console.error(e);
    return "Error in math expression";
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
