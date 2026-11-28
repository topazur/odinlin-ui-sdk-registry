import { createLibrary } from '@openuidev/react-lang';
import { Button } from '../../ui/button/openui-react';
import { Input, InputClear, InputGroup } from '../../ui/input/openui-react';

export const library = createLibrary({
  root: 'Button',
  components: [Button, Input, InputGroup, InputClear],
});
