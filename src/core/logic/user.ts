import { PLATFORMS, type InternalGitUser, type Session, type User } from '$core/model/user';

export type UserLocals = { user: User; session: Session };
export function getInternalGitUser(locals: UserLocals): InternalGitUser;
export function getInternalGitUser(user: User, session: Session): InternalGitUser;
export function getInternalGitUser(
	userOrLocals: User | { user: User; session: Session },
	session?: Session
): InternalGitUser {
	if (session && 'id' in userOrLocals) {
		return {
			id: userOrLocals.id,
			username: session.username,
			email: userOrLocals.email,
			platform: PLATFORMS.GITHUB,
			token: session.gitToken
		};
	} else {
		const { user, session } = userOrLocals as UserLocals;
		return {
			id: user.id,
			username: session.username,
			email: user.email,
			platform: PLATFORMS.GITHUB,
			token: session.gitToken
		};
	}
}
