import type { InternalGitUser, Session, User } from '$core/model/user';

type Locals = { user: User; session: Session };
export function createInternalGitUser(locals: Locals): InternalGitUser;
export function createInternalGitUser(user: User, session: Session): InternalGitUser;
export function createInternalGitUser(
	userOrLocals: User | { user: User; session: Session },
	session?: Session
): InternalGitUser {
	if (session && 'id' in userOrLocals) {
		return {
			id: userOrLocals.id,
			username: session.username,
			token: session.gitToken
		};
	} else {
		const { user, session } = userOrLocals as Locals;
		return {
			id: user.id,
			username: session.username,
			token: session.gitToken
		};
	}
}
