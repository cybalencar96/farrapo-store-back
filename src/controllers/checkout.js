import { makeServices } from '../services/services.js';

const services = makeServices();

async function transferFromCartToHistory(req, res) {
    const {
        cart,
    } = req.body;

    try {
        const { body, error } = await services.checkout({cart, token: res.locals.token})
        
        if (error) {
            return res.status(400).send(error.text);
        }

        res.status(200).send({ token: body });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export {
    transferFromCartToHistory,
};