export const generateSuggestions = async (description: string) => {
  await new Promise((r) => setTimeout(r, 700));
  const base = description.toLowerCase();
  const causes = [
    base.includes('timeout') ? 'Upstream dependency saturation under load' : 'Unclear operational handoff',
    'Insufficient observability for early anomaly detection',
    'Runbook did not match real failure mode'
  ];
  return {
    causes,
    preventive: ['Add SLO-based autoscaling guardrails', 'Improve alert routing ownership', 'Run chaos tests for this component']
  };
};
