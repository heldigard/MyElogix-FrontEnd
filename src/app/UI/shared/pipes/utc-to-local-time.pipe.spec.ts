import { UtcToLocalTimePipe } from './utc-to-local-time.pipe';
import { UtcConverterService } from '../services/utc-converter.service';

describe('UtcToLocalTimePipe', () => {
  let pipe: UtcToLocalTimePipe;
  let utcConverterService: UtcConverterService;

  beforeEach(() => {
    utcConverterService = new UtcConverterService();
    pipe = new UtcToLocalTimePipe(utcConverterService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
