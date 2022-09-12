import React from "react";
import axios from "axios";

interface orgProps {
  orgCode: string;
  setIsCreateOrg: (value: boolean) => void;
}
const api_url = "https://mern-todo-4b973.ew.r.appspot.com/";

const CreateOrg = ({ orgCode, setIsCreateOrg }: orgProps) => {
  const [orgName, setOrgName] = React.useState("");

  const onSubmit = async () => {
    if (orgName) {
      await axios
        .post(api_url + "/org", {
          name: orgName,
          code: orgCode,
        })
        .then((res) => {
          if (res.status === 200) {
            setOrgName("");
            setIsCreateOrg(false);
          }
        });
    }
  };
  return (
    <div>
      <div className="mb-4">
        <label className="mb-2">org name</label>
        <input
          onChange={(e) => setOrgName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-400 rounded-md"
          type="text"
          placeholder="org name"
        />
      </div>
      <button
        className="rounded-lg px-6 py-2 font-bold bg-green-400 text-white"
        onClick={onSubmit}
      >
        Create
      </button>
    </div>
  );
};

export default CreateOrg;
