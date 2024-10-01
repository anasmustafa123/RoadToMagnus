import { useOutletContext } from 'react-router-dom';

const Stats = () => {
  const { outletStyles } = useOutletContext<any>();
  return <div style={outletStyles}>Stats</div>;
};

export default Stats;
