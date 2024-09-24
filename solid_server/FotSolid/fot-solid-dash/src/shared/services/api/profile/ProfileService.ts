import { getDefaultSession } from "@inrupt/solid-client-authn-browser";
import { Environment } from "../../../environment";
import { getSolidDataset, getStringNoLocale, getThing, saveSolidDatasetAt, setStringNoLocale, setThing, ThingPersisted } from "@inrupt/solid-client";
import { FOAF, VCARD } from "@inrupt/vocab-common-rdf";

export interface IUserProfile {
    firstName: string,
    lastName: string,
    email: string,
    birthday: string,
    gender: string
}

const getSourcePath = (webid: string) => {

    const parts = webid.split('/'); // Divide a string em partes usando '/' como delimitador
    const baseUrl = parts.slice(0, 4).join('/'); // Seleciona as primeiras 4 partes e junta-as novamente com '/'

    return baseUrl;
}

const getProfile = async (): Promise<IUserProfile | Error> => {

    try {
        if (getDefaultSession().info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {
                const profileUrl = getDefaultSession().info.webId || '';

                const myDataset = await getSolidDataset(profileUrl, { fetch: getDefaultSession().fetch });

                const prof = getThing(myDataset, profileUrl);

                const profile: IUserProfile = prepareProfile(prof);
                return profile;

            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || Environment.ERROR_PROFILE);
    }
}

const updateProfile = async (prof: IUserProfile): Promise<Error | void> => {
    try {
        if (getDefaultSession().info.isLoggedIn) {
            if (getDefaultSession().info.webId !== undefined) {

                const profileUrl = getDefaultSession().info.webId || '';

                let myDataset = await getSolidDataset(profileUrl, { fetch: getDefaultSession().fetch });

                let profile = getThing(myDataset, profileUrl);

                if (profile !== null) {
                    profile = setStringNoLocale(profile, FOAF.firstName, prof.firstName);
                    profile = setStringNoLocale(profile, FOAF.lastName, prof.lastName);
                    profile = setStringNoLocale(profile, FOAF.birthday, prof.birthday);
                    profile = setStringNoLocale(profile, FOAF.mbox, prof.email);
                    profile = setStringNoLocale(profile, FOAF.gender, prof.gender);

                    myDataset = setThing(myDataset, profile);

                    await saveSolidDatasetAt(profileUrl, myDataset, {
                        fetch: getDefaultSession().fetch
                    });
                }

            } else {
                return new Error(Environment.WEB_ID_ERROR);
            }
        } else {
            return new Error(Environment.USER_NOT_LOGGED);
        }
    } catch (error) {
        return new Error((error as { message: string }).message || Environment.ERROR_PROFILE);
    }
}

const prepareProfile = (prof: ThingPersisted | null): IUserProfile => {

    let profile: IUserProfile = {
        firstName: '',
        lastName: '',
        birthday: '',
        email: '',
        gender: ''
    }

    if (prof !== null) {
        profile.firstName = getStringNoLocale(prof, FOAF.firstName) ?? '';
        profile.lastName = getStringNoLocale(prof, FOAF.lastName) ?? '';
        profile.birthday = getStringNoLocale(prof, FOAF.birthday) ?? '';
        profile.email = getStringNoLocale(prof, FOAF.mbox) ?? '';
        profile.gender = getStringNoLocale(prof, FOAF.gender) ?? '';
    }

    return profile;
}

// const queryUserProfile = (): string => {
//     let query = '';

//     return query;
// }

export const ProfileServices = {
    getProfile,
    updateProfile
};