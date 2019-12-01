import { Enumeration } from '../../common/factory'
import { LOG_TYPES } from '../../common/constants'

export const LOG = new Enumeration({
	key: 'type',
	name: 'Log',
	collection: 'logs',
	types: {
		user: LOG_TYPES.USER,
		server: LOG_TYPES.SERVER
	}
})

export const USER = new Enumeration({
	name: 'User',
	collection: 'users'
})

export const COMPANY = new Enumeration({
	name: 'Company',
	collection: 'companies'
})

export const PROJECT = new Enumeration({
	key: '_type',
	name: 'Project',
	collection: 'projects',
	types: {
		cse: 'CSEProject'
	}
})

export const ESTABLISHMENT = new Enumeration({
	name: 'Establishment',
	collection: 'establishments'
})

export const COLLEGE = new Enumeration({
	name: 'College',
	collection: 'colleges'
})

export const LIST = new Enumeration({
	name: 'List',
	collection: 'lists'
})

export const VOTE = new Enumeration({
	name: 'Vote',
	collection: 'votes'
})

export const ENC_TYPES = new Enumeration({
	NONE: 'none',
	HASH: 'hash',
	KEY: 'key'
})

export const JOBS = new Enumeration({
	CODE: 'code',
	LOCK: 'lock',
	READY: 'ready',
	START: 'start',
	END: 'end',
	CLEAN: 'clean'
})
