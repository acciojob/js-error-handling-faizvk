//your code here
// Custom Errors
class OutOfRangeError extends Error {
  constructor(arg) {
    super(`Expression should only consist of integers and +-/* characters and not ${arg}`);
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
    if (typeof expression !== "string") {
      throw new OutOfRangeError(expression);
    }

    const expr = expression.trim();

    // 1. Check for invalid characters (anything except digits, + - * / and space)
    const invalidCharMatch = expr.match(/[^0-9+\-*/\s]/);
    if (invalidCharMatch) {
      throw new OutOfRangeError(invalidCharMatch[0]);
    }

    // Remove spaces for structural checks
    const compact = expr.replace(/\s+/g, "");

    if (compact.length === 0) {
      throw new SyntaxError("Expression should not start with invalid operator");
    }

    // 2. Start with +,*,/
    if (/^[+*/]/.test(compact)) {
      throw new SyntaxError("Expression should not start with invalid operator");
    }

    // 3. End with +,/,* or -
    if (/[+\-*/]$/.test(compact)) {
      throw new SyntaxError("Expression should not end with invalid operator");
    }

    // 4. Invalid operator combinations (++, /+, *-, etc.)
    // Allow minus only when it represents a negative number, not as a second operator
    if (/[+\-*/]{2,}/.test(compact)) {
      // Special-case: allow patterns like "*-3" or "+-5" (negative numbers after operator)
      // So we reject only true operator pairs
      const badCombo = compact.match(/([+*/-])([+*/])/);
      if (badCombo) {
        throw new InvalidExprError();
      }
    }

    // Final evaluation (safe here because we already validated characters)
    return Function(`"use strict"; return (${compact})`)();
  } catch (err) {
    // Do not alter this behavior if your starter code already has catch logic
    throw err;
  }
}
