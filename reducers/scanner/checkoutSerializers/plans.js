const plansSerializer = payload => {
  let estimations = payload.estimations || [];

  if (typeof estimations === 'string') {
    // Try to parse as JSON
    estimations = JSON.parse(payload.estimations.replace(/'/g, '"'));
  }
  return estimations.map(plan => ({ id: plan.plan_id, name: plan.name, slug: plan.slug }));
};

export default plansSerializer;
