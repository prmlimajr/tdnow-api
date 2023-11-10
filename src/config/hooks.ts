import { createHook, executionAsyncId } from 'async_hooks';
import { User } from 'src/database/entity/user.entity';
import { v4 as uuidv4 } from 'uuid';

type ExecutionContext = {
  id: string;
  user?: Pick<User, 'id' | 'email'>;
  machineIp?: string;
};
const store = new Map<number, ExecutionContext>();

const asyncHook = createHook({
  init: (asyncId, type, triggerAsyncId) => {
    const parentContext = store.get(triggerAsyncId);
    if (!parentContext) {
      return;
    }
    store.set(asyncId, parentContext);
  },
  destroy: (asyncId) => {
    store.delete(asyncId);
  },
});

asyncHook.enable();

export const createExecutionContext = (machineIp?: string) => {
  const context: ExecutionContext = { id: uuidv4(), machineIp };
  store.set(executionAsyncId(), context);
  return context;
};

export const getExecutionContext = (): ExecutionContext | undefined => {
  return store.get(executionAsyncId());
};

export const setLoggedUser = (user: User): void => {
  const context = getExecutionContext();

  if (context) {
    context.user = {
      id: user.id,
      email: user.email,
    };
  }
};
