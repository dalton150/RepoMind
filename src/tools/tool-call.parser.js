const extractJsonObject = (text) => {
  const start = text.indexOf("{");

  if (start === -1) {
    return null;
  }

  let depth = 0;

  for (let index = start; index < text.length; index += 1) {
    const char = text[index];

    if (char === "{") {
      depth += 1;
    }

    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  return null;
};

export const parseModelOutput = (text = "") => {
  const trimmed = String(text).trim();

  if (!trimmed) {
    return {
      type: "final",
      content: "",
    };
  }

  const jsonText = extractJsonObject(trimmed);

  if (jsonText) {
    try {
      const data = JSON.parse(jsonText);

      if (data && typeof data.tool === "string" && data.tool.trim()) {
        return {
          type: "tool_call",
          name: data.tool.trim(),
          arguments:
            data.arguments && typeof data.arguments === "object"
              ? data.arguments
              : data.args && typeof data.args === "object"
                ? data.args
                : {},
        };
      }
    } catch {
      // Fall through to final answer.
    }
  }

  return {
    type: "final",
    content: trimmed,
  };
};
