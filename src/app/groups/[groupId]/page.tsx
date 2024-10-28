"use client";

import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

import { fetchGroups } from "@/app/query-functions";
import Spinner from "@/app/components/Spinner";
import { Group } from "@prisma/client";

export default function GroupPage() {
  const { user } = useUser();
  const {
    status,
    data: groups,
    error,
  } = useQuery({
    queryKey: ["groups"],
    queryFn: () => fetchGroups(user!.id),
  });

  return (
    <div className="flex-grow p-2">
      <div className="flex items-center justify-center">
        {status === "pending" && <Spinner />}
        {status === "error" && <h1>{error.message}</h1>}
      </div>
      {groups?.length > 0 &&
        groups.map((group: Group) => <h3 key={group.id}>{group.name}</h3>)}
    </div>
  );
}
