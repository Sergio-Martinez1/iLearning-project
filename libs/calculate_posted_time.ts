export function calculate_posted_time(publication_date: string) {
    if (publication_date) {
        let publication_date_parse = Date.parse(publication_date);
        let time_now = Date.now();
        let diference = time_now - publication_date_parse;

        diference = Math.floor(diference / 1000);
        if (diference < 0) diference = 0;
        let output = `${diference} s`;

        if (diference > 60) {
            diference = Math.floor(diference / 60);
            output = `${diference} min`;
            if (diference > 60) {
                diference = Math.floor(diference / 60);
                output = `${diference} hrs`;
                if (diference > 24) {
                    diference = Math.floor(diference / 24);
                    output = `${diference} d`;
                    if (diference > 365) {
                        diference = Math.floor(diference / 365);
                        output = `${diference} y`;
                    }
                }
            }
        }
        return output;
    } else return "no date";
}