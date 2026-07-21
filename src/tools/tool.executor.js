export const executeTool = async (
  { name, arguments: args = {} },
  registry
) => {
  const activeRegistry =
    registry ??
    (await import("./default-tool.registry.js")).defaultToolRegistry;

  const tool = activeRegistry.getTool(name);

  if (!tool) {
    const error = new Error(`Unknown tool: ${name}`);
    error.statusCode = 400;
    throw error;
  }

  const parsed = tool.argsSchema.safeParse(args);

  if (!parsed.success) {
    const error = new Error("Invalid tool arguments");
    error.statusCode = 400;
    error.details = parsed.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    throw error;
  }

  const result = await tool.execute(parsed.data);

  return {
    tool: name,
    arguments: parsed.data,
    result,
  };
};
