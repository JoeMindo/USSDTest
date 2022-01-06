import { expect } from 'chai';
import { describe, it } from 'mocha';
import { renderBuyerMenus } from '../../src/menus/rendermenu.js';

describe('Buyer', () => {
  it('should see the relevant menus', () => {
    expect(typeof (renderBuyerMenus())).to.equal('string');
  });
});