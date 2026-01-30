// Custom Errors
class OutOfRangeError extends Error {
  constructor(arg) {
    super(`Expression should only consist of integers and +-/* characters and not '${arg}'`);
    this.name = "OutOfRangeError";
  }
}

class InvalidExprError extends Error {
  constructor() {
    super("Expression should not have an invalid combination of expression");
    this.name = "InvalidExprError";
  }
}

// Evaluator
function evalString(expression) {
  try {
    const expr = expression.trim();

    // invalid characters
    const bad = expr.match(/[^0-9+\-*/\s]/);
    if (bad) throw new OutOfRangeError(bad[0]);

    const compact = expr.replace(/\s+/g, "");

    // start with + * /
    if (/^[+*/]/.test(compact)) {
      throw new SyntaxError("Expression should not start with invalid operator");
    }

    // end with operator
    if (/[+\-*/]$/.test(compact)) {
      throw new SyntaxError("Expression should not end with invalid operator");
    }

    // invalid operator combos (except +- for negatives)
    if (/([+*/]{2,})|([+\-*/][+*/])/.test(compact)) {
      throw new InvalidExprError();
    }

    // evaluate
    Function(`return ${compact}`)();
    return true;
  } catch (e) {
    throw e;
  }
}

// Button handler (REQUIRED by Cypress)
function handleEval() {
  const val = document.getElementById("input1").value;

  try {
    evalString(val);
    alert("passed");
  } catch (e) {
    alert("failed");
    throw e; // Cypress listens for this
  }
}
