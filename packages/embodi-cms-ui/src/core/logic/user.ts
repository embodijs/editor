import { PLATFORMS, type InternalGitUser, type Session, User } from '$core/model/user';
import * as v from 'valibot';

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

export function getUser(locals: UserLocals): User;
export function getUser(user: User, session: Session): User;
export function getUser(userOrLocals: User | { user: User; session: Session }): User {
	if ('id' in userOrLocals) {
		return v.parse(User, userOrLocals);
	} else {
		const { user } = userOrLocals as UserLocals;
		return v.parse(User, user);
	}
}
