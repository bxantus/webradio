export interface Subscription {
    unsubscribe():void
}

export interface Subscriber<T> {
    onChange(newVal:T):void
}

export class SubscriptionRepository {
    add(name:string, changeFunc:(newVal:any) => void):Subscription {
        let subsForName = this.subs.get(name) || []
        if (subsForName.length == 0) {
            this.subs.set(name, subsForName)
        }

        let sub = { onChange: changeFunc }
        subsForName.push(sub)
        return {
            unsubscribe: () => {
                const idx = subsForName.findIndex(val => val == sub)
                if (idx >= 0) subsForName.splice(idx)
            }
        }
    }

    notifyFor(name:string, newVal:any) {
        let subsForName = this.subs.get(name)
        if (subsForName)
            for (let s of subsForName) s.onChange(newVal)
    }

    private subs = new Map<string, Subscriber<any>[]>()
}

