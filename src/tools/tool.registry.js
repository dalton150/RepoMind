export const createToolRegistry = (tools) => {
  const toolMap = Object.fromEntries(
    tools.map((tool) => [tool.name, tool])
  );

  return {
    getTool: (name) => toolMap[name] || null,

    listTools: () =>
      Object.values(toolMap).map((tool) => ({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      })),

    getAllowedToolNames: () => Object.keys(toolMap),
  };
};
