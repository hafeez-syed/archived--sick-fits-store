import Link from "next/link";
import UpateItem from "../components/UpateItem";
const Update = ({ query }) => {
  return <UpateItem id={query.id} />;
};

export default Update;
