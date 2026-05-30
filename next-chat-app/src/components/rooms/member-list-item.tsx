import { RoomMember, User } from "@/generated/prisma/client";
import { getAvatarColorClass } from "@/lib/avatar-colors";

type MemberListItemProps = {
  member: RoomMember & {
    user: User;
  };

  isOwner: boolean;
};

export function MemberListItem({ member, isOwner }: MemberListItemProps) {
  const initials = member.user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl px-2 py-2 transition bg-[#1d1d1d] hover:bg-[#161616]">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-semibold text-white ${getAvatarColorClass(
          member.user.avatarColor,
        )}`}
      >
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-neutral-200">
          {member.user.name}
        </p>

        <p className="text-[11px] text-neutral-600">
          {isOwner ? "Owner" : "Member"}
        </p>
      </div>
    </div>
  );
}
