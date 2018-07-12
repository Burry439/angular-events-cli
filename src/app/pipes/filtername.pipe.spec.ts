import { FilterByNamePipe } from './filtername.pipe';

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterByNamePipe();
    expect(pipe).toBeTruthy();
  });
});
