interface createOrgProps {
  setOrgName: (name: string) => void;
}

const CreateOrg = ({ setOrgName }: createOrgProps) => {
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
    </div>
  );
};

export default CreateOrg;
