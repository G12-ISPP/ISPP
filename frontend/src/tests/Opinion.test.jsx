import Opinion from '../components/Opinion';
import { render, waitFor, screen, prettyDOM } from "@testing-library/react";
import { expect } from "chai";
import { vi } from 'vitest';

describe('OK Opinion Component', () => {

  test('Render Opinion component with normal data', async () => {

    /* ARRANGE */
    const user = {
      id: 10,
      first_name: "Nicolás",
      last_name: "Irizo Ramos"
    };

    mockFetch(user);

    const opinion = {
      id: 1,
      score: 4.0,
      author: 10,
      target_user: 9,
      date: "2022-01-01",
      description: "Great product!"
    };
    mockFetch(opinion);

    /* ACT */
    const { container } = render(<Opinion opinion={opinion}  key={opinion.id}/>);
    await waitFor(() => { expect(screen.getAllByText("Great product!")).to.exist; });

    /* ASSERT */
    assertOKOpinion(opinion, user, container);

  });

});

function assertOKOpinion(opinion, user, target_user, container) {
  const checkOpinion = ["date", "description"];

  for (let i = 0; i < checkOpinion.length; i++) {
    const expectedText = new RegExp(opinion[checkOpinion[i]]);
    expect(screen.getByText(expectedText)).to.exist;
  }

}

function mockFetch(object) {
  vi.spyOn(window, 'fetch').mockImplementationOnce(() => {
      return Promise.resolve({
          json: () => Promise.resolve(object),
      });
  });
}
