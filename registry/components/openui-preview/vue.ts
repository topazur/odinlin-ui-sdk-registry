import { createLibrary } from '@openuidev/vue-lang';
import { Button } from '../../ui/button/openui-vue';
import { Input, InputClear, InputGroup } from '../../ui/input/openui-vue';

export const library = createLibrary({
  root: 'Button',
  components: [Button, Input, InputGroup, InputClear],
});
